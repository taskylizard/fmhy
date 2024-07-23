import {
  LiRenderer,
  LinkRenderer,
  PRenderer,
  CodeRenderer,
  HeadingRenderer,
  UlRenderer,
  BlockquoteRenderer,
} from "@/lib/wiki/renderers";
import ReactMarkdown, { Components } from "react-markdown";
import GithubSlugger from "github-slugger";
import gfm from "remark-gfm";

const MarkdownRenderer = ({
  category,
  showOnlyStarred,
  children,
  components,
}: {
  category?: string;
  showOnlyStarred?: boolean;
  children: string;
  components?: Partial<Components> | null | undefined;
}) => {
  const slugger = new GithubSlugger();
  slugger.reset();

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      components={{
        h1: (props) => HeadingRenderer(props, 1, slugger),
        h2: (props) => HeadingRenderer(props, 2, slugger),
        h3: (props) => HeadingRenderer(props, 3, slugger), //for beginners guide only
        h4: (props) => HeadingRenderer(props, 4, slugger), //for storage only
        p: PRenderer, // for beginners guide only
        a: LinkRenderer,
        li: (props) => LiRenderer(props, showOnlyStarred), //for storage only
        hr: () => <></>,
        code: (props) => CodeRenderer(props, category), // for base64 only
        ul: (props) => UlRenderer(props),
        blockquote: (props) => BlockquoteRenderer(props, category),
        ...components,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
export default MarkdownRenderer;
