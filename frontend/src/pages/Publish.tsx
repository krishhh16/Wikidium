import { ChangeEvent, useState } from "react";
import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import z from 'zod'
import { useNavigate } from "react-router-dom";

const CreateBlogInput = z.object({
    title: z.string(),
    content: z.string()
}
)
type CreateBlogInput = z.infer<typeof CreateBlogInput>

export const Publish = () => {
    const navigate = useNavigate()
    const [title, setTitle]  = useState("")
    const [description, setDescription] = useState("")
  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full py-8">
        <div className="max-w-screen-lg w-full">
          <input
            onChange={(e) => {
                setTitle(e.target.value)
            }}
            type="email"
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="name@flowbite.com"
          />
          <TextEditor onChange={(e) => {
            setDescription(e.target.value)
          }} />
          <button
            onClick = {async () => {
                const requestData: CreateBlogInput = {
                    title,
                    content: description
                }
                const response = await axios.post(`${BACKEND_URL}/api/v1/blog`,requestData , {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                navigate(`/blog/${response.data.id}`)
            }}
            type="submit"
            className="mt-4 inline-flex item center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};
function TextEditor({onChange} : {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
  return (
    <form>
      <div className="w-full mb-4">
        <div className="flex item-center justify-between px-3 py- border-b">
          <div className="py-2 bg-white rounded-b-lg w-full">
            <label className="sr-only">Publish Post</label>
            <textarea
              onChange={onChange}
              id="editor"
              rows={8}
              className="focus:outline-none block w-full px-0 text-sm text-grey-800 bg-white border-0"
              placeholder="Write your post here..."
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
}
