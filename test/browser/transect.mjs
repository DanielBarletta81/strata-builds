/* global document, getComputedStyle, visualViewport */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { URL, pathToFileURL } from 'node:url';
import { faciesSettings, transectEvidence, transectSources } from '../../src/features/deep-time/tethys/transect/evidence.ts';
import { ageCoverage, coverageLabels } from '../../src/features/deep-time/tethys/transect/model.ts';

const playwrightModule = process.env.STRATA_PLAYWRIGHT_MODULE;
const { chromium } = await import(playwrightModule ? pathToFileURL(resolve(playwrightModule)).href : 'playwright-core');
const origin = new URL(process.env.STRATA_TEST_ORIGIN ?? 'http://127.0.0.1:3254').origin;
const out = process.env.STRATA_SCREENSHOT_DIR;
if (out) await mkdir(out, { recursive: true });
const representative = new Set(['subtidal-limestone', 'posta-megabreccia', 'rischi-biozone']);
const browser = await chromium.launch({ executablePath: process.env.STRATA_CHROMIUM_EXECUTABLE, headless: true });
const light = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number).reduce((sum, value, index) => {
  const channel = value / 255;
  const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  return sum + [0.2126, 0.7152, 0.0722][index] * linear;
}, 0);
try {
  for(const [width,device] of [[375,'mobile'],[768,'tablet'],[1440,'desktop']]){
    const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1,isMobile:width===375,hasTouch:width===375,reducedMotion:'reduce'});
    page.setDefaultTimeout(7500);
    const errors=[], requests=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error'&&message.location().url!==origin+'/favicon.ico') errors.push(message.text());});
    page.on('requestfailed',req=>errors.push(req.url()));
    page.on('request',req=>{if(!req.url().startsWith('data:')&&new URL(req.url()).origin!==origin) requests.push(req.url());});
    const response=await page.goto(origin+'/deep-time#tethys',{waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    const tethys=page.getByRole('region',{name:'The Tethys Ocean · 111 Ma'});
    const timeline=page.getByRole('combobox',{name:'Selected event'});
    const lab=tethys.getByRole('region',{name:'Ancient Seaway Laboratory'});
    const layers=lab.getByRole('group',{name:'Seaway evidence layers'});
    const transect=lab.getByRole('region',{name:'Comparative facies transect'});
    const panel=transect.locator('[data-transect-record]');
    const environment=transect.getByRole('group',{name:'Depositional environments'});
    const options=transect.getByRole('group',{name:'Reported observations'});
    const open=transect.getByText('Stratigraphy, dating and source rights',{exact:true});
    const activate=(locator)=>width===375? locator.tap() : locator.press('Enter');
    const focus=(locator)=>locator.evaluate(node=>node===document.activeElement&&node.matches(':focus-visible'));
    const layout=async()=>{
      assert.equal(await page.evaluate(()=>visualViewport.width),width);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      const clipped=await lab.locator('h3,h4,h5,button,summary,li,dd').evaluateAll(nodes=>nodes.filter(node=>node.getClientRects().length&&node.clientWidth>0&&node.scrollWidth>node.clientWidth+1).map(node=>node.innerText));
      assert.deepEqual(clipped,[]);
    };
    const contrast=async(locator)=>{
      const colors=await locator.evaluate(node=>{
        const fg=getComputedStyle(node).color;
        let parent=node;
        while(getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)') parent=parent.parentElement;
        return [fg,getComputedStyle(parent).backgroundColor];
      });
      const [a,b]=colors.map(light).sort((x,y)=>y-x);
      assert.ok((a+.05)/(b+.05)>=4.5);
    };
    await tethys.locator('[data-tethys-unavailable]').waitFor();
    assert.equal(await lab.count(),0);
    await activate(tethys.getByRole('button',{name:'Select 111 Ma in the timeline'}));
    assert.equal(await timeline.inputValue(),'tethys');
    const originalMap=lab.getByRole('img',{name:/reconstructed at 111 million years ago/});
    await originalMap.waitFor();
    assert.equal(await originalMap.locator('g[class*="_crust"] path').count(),193);
    assert.equal(await originalMap.locator('[data-type]').count(),85);
    assert.equal(await originalMap.locator('[data-map-checkpoint]').count(),11);
    assert.equal(await layers.getByRole('button').count(),4);
    const tab=layers.getByRole('button',{name:'Platform-to-Basin Transect'});
    assert.ok((await tab.boundingBox()).height>=44);
    await tab.press('Enter');
    assert.ok(await focus(tab));
    await transect.getByText(/no scale for distance, water depth or bed thickness/).waitFor();
    await transect.getByText(/no demonstrated sediment pathway/).waitFor();

    for(const group of faciesSettings){
      const button=environment.getByRole('button',{name:new RegExp(group.title)});
      assert.ok((await button.boundingBox()).height>=44);
      await activate(button);
      assert.equal(await button.getAttribute('aria-pressed'),'true');
      assert.equal(await options.getByRole('button').count(),3);
      for(const record of transectEvidence.filter(({setting})=>setting===group.id)){
        const choice=options.getByRole('button',{name:record.name,exact:true});
        await choice.press('Space');
        assert.ok(await focus(choice));
        assert.equal(await choice.getAttribute('aria-pressed'),'true');
        assert.equal(await panel.getAttribute('data-transect-record'),record.id);
        await panel.getByText(coverageLabels[ageCoverage(record.age)],{exact:true}).waitFor();
        await panel.getByText('Geographic restoration unavailable',{exact:true}).waitFor();
        for(const label of ['Observed in the source','Geological interpretation','Still unresolved']) await panel.getByText(label,{exact:true}).waitFor();
        assert.equal(await panel.getByRole('link').first().getAttribute('href'),transectSources[record.references[0].source].url);
        await activate(open);
        await panel.getByText('Restoration needed',{exact:true}).waitFor();
        assert.ok((await panel.innerText()).includes(record.references[0].locator));
        assert.ok((await panel.innerText()).includes(transectSources[record.references[0].source].access));
        assert.equal(await transect.locator('svg,canvas,[data-tethys-map]').count(),0);
        await contrast(choice);
        await contrast(panel.locator('dd').first());
        await layout();
        if(out && (width===1440 || representative.has(record.id))){
          await page.evaluate(()=>document.activeElement.blur());
          await transect.screenshot({path:out+'/'+record.id+'-'+device+'.png'});
        }
        await activate(open);
      }
    }

    const biozone=options.getByRole('button',{name:'Planktonic fossil zone'});
    assert.equal(await biozone.evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
    await page.emulateMedia({reducedMotion:'no-preference'});
    assert.notEqual(await biozone.evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
    await page.emulateMedia({reducedMotion:'reduce'});
    await activate(biozone);
    await panel.getByText('112.80–110.70 Ma in the published tuned model',{exact:true}).waitFor();
    await layers.getByRole('button',{name:'Regional Marine Evidence'}).press('Enter');
    assert.equal(await lab.locator('[data-seaway-record]').getAttribute('data-seaway-record'),'poggio-le-guaine');
    await layers.getByRole('button',{name:'Open Questions'}).press('Enter');
    assert.equal(await lab.locator('[data-seaway-record]').getAttribute('data-seaway-record'),'poggio-le-guaine');
    await tab.press('Enter');
    assert.equal(await panel.getAttribute('data-transect-record'),'rischi-biozone');
    await activate(environment.getByRole('button',{name:/Platform margin/}));
    await options.getByRole('button',{name:'Mattinata slope deposits'}).press('Enter');
    await layers.getByRole('button',{name:'Plate Reconstruction'}).press('Enter');
    assert.equal(await lab.getByRole('combobox',{name:'Inspect a model checkpoint'}).inputValue(),'apulia');
    await tab.press('Enter');
    assert.equal(await panel.getAttribute('data-transect-record'),'mattinata-slope');
    await layout();
    await timeline.selectOption('holocene');
    assert.equal(await transect.count(),0);
    await tethys.getByText(/11\.7 ka before 2000 CE/).waitFor();
    await timeline.selectOption('origins');
    assert.equal(await lab.count(),0);
    await tethys.getByText(/Date unresolved/).waitFor();
    assert.deepEqual(errors,[]);
    assert.deepEqual(requests,[]);
    process.stdout.write(`${width}px passed for all nine records, four layers, and the Phase 2 geometry.\n`);
    await page.close();
  }
} finally { await browser.close(); }
