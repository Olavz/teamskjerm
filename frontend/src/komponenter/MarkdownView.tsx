import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

type Props = {
  markdown: string;
};

export function MarkdownView({ markdown }: Props) {
  return (
    <article className="prose">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
