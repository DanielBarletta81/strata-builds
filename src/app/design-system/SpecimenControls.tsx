"use client";
import { useState } from "react";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Button from "../../components/ui/Button";
export default function SpecimenControls() {
  const [value, setValue] = useState("Overview");
  return (
    <>
      <SegmentedControl
        label="Illustrative evidence view"
        options={["Overview", "Comparison", "Limitations"]}
        value={value}
        onChange={setValue}
      />
      <p role="status">
        Illustrative view selected: {value}. No scientific data is loaded.
      </p>
      <Button onClick={() => setValue("Overview")}>Reset example</Button>
    </>
  );
}
