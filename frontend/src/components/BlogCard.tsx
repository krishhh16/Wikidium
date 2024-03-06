import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedData: string;
  id: number
}

export const BlogCard = ({
  authorName,
  title,
  content,
  publishedData,
  id
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
    <div className="border-b border-slate-200 pb-4 w-screen max-w-screen-md ">
      <div className="flex">
          <Avatar size={'big'} name={authorName} />
        <div className="font-entralight text-sm flex justify-center flex-col pl-1">{authorName}</div>
        <div className="text-xs text-sm flex justify-center flex-col px-1 py-1">&#9679;</div>
        <div className="pl-2 text-sm flex justify-center flex-col font-thin text-slate-500">{publishedData}</div>
      </div>
      <div
        className="text-xl font-semibold pt-2"
      >{title}</div>
      <div
        className="text-xl font-thin"
      >
        {content.length > 100 ? `${content.slice(0, 100)}...` : content}
      </div>
      <div
        className="text-slate-500 text-sm font-thin pt-2"
      >{`${Math.ceil(content.length / 100)} minute(s) read`}</div>
    </div>
    </Link>
  );
};

export function Avatar({ name, size="small" }: { name: string; size?: "small"|"big" }) {
  return (
    <div className={`relative ${size === 'small' ? "w-6 h-6" : "w-10 h-10"} inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
      <span className="text-xs text-gray-600 dark:text-gray-300">
        {name[0]}
      </span>
    </div>
  );
}
