"use client";

import { Mc521 } from "@/components";
import { IndexSlice } from "@/slices";

export default function Page() {
    return (
        <div className="pixel-font h-full w-screen">
            <IndexSlice.Home />
            <IndexSlice.About />
            <IndexSlice.Device />
            <IndexSlice.EcoSystem />
            <IndexSlice.Team />
            <IndexSlice.Photos />
            <IndexSlice.Events />
            <IndexSlice.Milestones />
            <IndexSlice.Changelog />
            <IndexSlice.Join />
            <Mc521.Footer />
        </div>
    );
}
