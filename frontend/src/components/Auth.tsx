import { SigninInput } from "@krishhh/medium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import z from "zod"
import axios from "axios";
interface AuthProp {
  type: "Signup" | "Signin";
}
const signInInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    username: z.string()
})
type signInInput = z.infer<typeof signInInput>
export const Auth = ({ type }: AuthProp) => {
    const navigate = useNavigate()
  const [postInputs, setPostInputs] = useState<signInInput>({
    name: "",
    email: "",
    password: "",
    username: ""
  });

  async function sendRequest() {
    try {
    let response
    if (type ==='Signin') {
        const postData = {
            email: postInputs.email,
            password: postInputs.password
        }
         response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postData)

    }else{
         response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInputs)
}
        const jwt = response.data;
        localStorage.setItem('token', jwt);
        navigate('/blogs')
    }catch (e){
        alert(JSON.stringify(e.response))
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">{type === 'Signup' ? "Create an account" : "Login"}</div>
            
            <div className="text-slate-400">
              {" "}
              {type === "Signup" ? "Already have an account?": "Don't have an account?"}{" "}
              <Link className="pl-2 underline" to={type =='Signin' ? "/signup" : "/signin"}>
                
                {type === "Signup" ? "Login": "Signup"}
{" "}
              </Link>
            </div>
          </div>
          {type === 'Signup'?
          <LabelledINput
            label="Name"
            type="text"
            placeholder="Krishna Tripathi"
            onChange={(e) => {
              setPostInputs((c) => ({
                ...c,
                name: e.target.value,
              }));
            }}
          /> : null}
          {type === 'Signup'?
          <LabelledINput
            label="Username"
            type="text"
            placeholder="Zombotron"
            onChange={(e) => {
              setPostInputs((c) => ({
                ...c,
                username: e.target.value,
              }));
            }}
          /> : null}
          <LabelledINput
            label="Email"
            type="email"
            placeholder="kt@gmail.com"
            onChange={(e) => {
              setPostInputs((c) => ({
                ...c,
                email: e.target.value,
              }));
            }}
          />
          <LabelledINput
            label="Password"
            type="password"
            placeholder="********"
            onChange={(e) => {
              setPostInputs((c) => ({
                ...c,
                password: e.target.value,
              }));
            }}
          />
          <button
            onClick={sendRequest}
            type="button"
            className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {type}
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

function LabelledINput({
  label,
  type,
  placeholder,
  onChange,
}: LabelledInputType) {
  return (
    <div>
      <label
        htmlFor="first_name"
        className="block mb-2 text-sm font-medium text-grey-900 dark:text-black"
      >
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id="first_name"
        className="bg-grey-50 border border-grey-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}
