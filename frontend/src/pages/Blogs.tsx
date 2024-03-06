import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";



export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return <div>
      <BlogSkeleton/>
      <BlogSkeleton/>
      <BlogSkeleton/>
      <BlogSkeleton/>
    </div>;
  }
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          {blogs.map(blog => {
            return (
              <BlogCard
                id={blog.id}
                authorName={blog.author.name || "Annonymouse"}
                content={blog.content}
                publishedData="1st january 2024"
                title={blog.title}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
