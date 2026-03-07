import { Mc521 } from "@/components";

const TEAMMEMBER_DATA = [
    {
        name: "LingyunAwA",
        position: ["技术", "客服"],
        image: "/images/team/LingyunAwA.webp",
    },
    {
        name: "FBK_Lynn",
        position: ["小游戏主管", "副本主管"],
        image: "/images/team/FBK_Lynn.webp",
    },
];

export function Team() {
    return (
        <Mc521.Section id="team" zebra>
            <div className="flex w-full max-w-3/5 flex-col items-center justify-center">
                <Mc521.SectionTitle title="管理团队" />
                <div className="mt-12 flex w-full flex-col items-center">
                    <Mc521.OwnerCard />
                    <Mc521.TeamSeparator />
                    <div className="grid w-full grid-cols-2 gap-x-12">
                        {TEAMMEMBER_DATA.map((item, index) => (
                            <Mc521.MemberCard key={index} name={item.name} position={item.position} image={item.image} />
                        ))}
                    </div>
                </div>
            </div>
        </Mc521.Section>
    );
}
