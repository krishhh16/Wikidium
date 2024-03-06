import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const BlogStruc = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl">
          <div className="col-span-8">
            <div className="text-3xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500 pt-2">
              Posted on 2nd december 2023
            </div>
            <div className="pt-4">{blog.content}</div>
          </div>
          <div className="col-span-4">
            Author
            <div className="flex">
                <Avatar size="small" name={blog.author.name || "Annonymous"}/>
              <div>
                <div className="text-xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  I am superior to you, no matter how you look at it
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
