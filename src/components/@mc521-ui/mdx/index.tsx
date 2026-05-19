import { ColoredText } from "./components/custom/colored-text";
import { EnchantsShowcase, GemCard, GemGrid, GemShowcase, ToolsShowcase } from "./components/custom/itemframe";
import { JewelryCard, JewelryGrid, JewelryShowcase } from "./components/custom/itemframe/jewelries";
import { EquipmentCard, EquipmentGrid, EquipmentShowcase, WeaponShowcase } from "./components/custom/itemframe/equipment";
import { MyImageWithTooltip } from "./components/custom/wrapped-media";
import { Pre, Code } from "./components/html/code";
import { Hr } from "./components/html/hr";
import { A } from "./components/html/link";
import { Ul, Ol, Li } from "./components/html/list";
import { MyImage, MyVideo, MySource } from "./components/html/media";
import { Blockquote } from "./components/html/quote";
import { Table, Thead, Tbody, Tr, Th, Td } from "./components/html/table";
import { Heading, HeadingProps, Paragraph } from "./components/html/title-and-paragraph";
import { MaterialShowcase } from "./components/custom/itemframe/materials";

// 导出所有组件
export const mdxComponents = {
    // HTML components
    h1: (props: Omit<HeadingProps, "level">) => <Heading level={1} {...props} />,
    h2: (props: Omit<HeadingProps, "level">) => <Heading level={2} {...props} />,
    h3: (props: Omit<HeadingProps, "level">) => <Heading level={3} {...props} />,
    h4: (props: Omit<HeadingProps, "level">) => <Heading level={4} {...props} />,
    h5: (props: Omit<HeadingProps, "level">) => <Heading level={5} {...props} />,
    h6: (props: Omit<HeadingProps, "level">) => <Heading level={6} {...props} />,
    p: Paragraph,
    ul: Ul,
    ol: Ol,
    li: Li,
    a: A,
    blockquote: Blockquote,
    table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
    hr: Hr,
    MyImage,
    MyVideo,
    MySource,
    code: Code,
    pre: Pre,

    // Custom components
    ColoredText,
    MyImageWithTooltip,

    // Itemframe components - Gems
    GemCard,
    GemGrid,
    GemShowcase,

    // Itemframe components - Jewelries
    JewelryCard,
    JewelryGrid,
    JewelryShowcase,

    // Itemframe components - Equipment
    EquipmentCard,
    EquipmentGrid,
    EquipmentShowcase,
    WeaponShowcase,

    // Itemframe components - Tools
    ToolsShowcase,

    // Itemframe components - Enchantments
    EnchantmentShowcase: EnchantsShowcase,

    // Itemframe components - Materials
    MaterialShowcase,
};
