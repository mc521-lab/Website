"use client";

import { Mc521 } from "@/components";
import { MilestoneItem } from "@/types/api";
import { RocketIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function Milestones() {
    const [milestones, setMilestones] = useState<MilestoneItem[]>([]);

    useEffect(() => {
        fetch("/api/data/milestones")
            .then((res) => res.json())
            .then((data: MilestoneItem[]) => {
                data.sort((a: MilestoneItem, b: MilestoneItem) => {
                    const [a1, a2, a3] = a.version;
                    const [b1, b2, b3] = b.version;
                    if (a1 !== b1) return a1 - b1;
                    if (a2 !== b2) return a2 - b2;
                    return a3 - b3;
                });
                setMilestones(data.slice(0, 4));
            });
    }, []);

    return (
        <Mc521.Section id="milestones">
            <div className="flex w-full flex-col items-center justify-center">
                <Mc521.SectionTitle title="发展历程" description="点击时间节点或拖动查看记录" />
                <Mc521.Milestone>
                    {milestones.map((item: MilestoneItem) => (
                        <Mc521.MilestoneItem
                            key={item.title}
                            date={item.date}
                            title={item.title}
                            description={item.description}
                            version={item.version.join(".")}
                            Icon={RocketIcon}
                        />
                    ))}
                </Mc521.Milestone>
            </div>
        </Mc521.Section>
    );
}
