import React from 'react';
import { Logo, Button, Input } from "../components/index.js";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../redux/useSlice.js';
import { signInWithPopup } from 'firebase/auth';
import { errorParser } from '../utils/errorParser.js';
const SignIn = () => {
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch()

    const signInWithGoogle =async()=>{
        signInWithPopup(auth,provider)
        .then((result)=>{
            console.log(result)
            dispatch(loginStart())
            axios.post('http://localhost:8000/api/v1/users/googleAuth',
            {
                fullname: result.user.displayName,
                email:result.user.email,
                avatar:result.user.photoURL,
            })
            .then((res)=>{
                sessionStorage.setItem("refreshToken",res.data.data.refreshToken)
                dispatch(loginSuccess(res.data.data)
                )})
            navigate("/")
        })
        .catch((error)=>{
            dispatch(loginFailure())
            throw error
        })
    }

    const login = async (data, event) => {
        event.preventDefault();
        dispatch(loginStart())
        setError("");
        try {
            const userData = await axios.post("http://localhost:8000/api/v1/users/login", data);
            sessionStorage.setItem('refreshToken', userData.data.data.refreshToken)
            dispatch(loginSuccess(userData.data.data))
            navigate("/")

        } catch (error) {

            setError(errorParser(error));
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className={`mx-auto w-full max-w-lg bg-custom-gray-2 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" textColor='text-black' />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-white">Sign up to create an account</h2>
                <p className="mt-2 text-center text-base text-white/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)}>
                    <div className='space-y-5'>
                        <Input
                            label="Username or Email:"
                            placeholder="Enter Username or Email"
                            {...register("usernameOrEmail", {

                                validate: {
                                    matchPattern: (value) => /^[^\s]+$/.test(value) || "Feild should not contain Spaces",
                                }
                            })}
                        />
                        {errors.usernameOrEmail && <p className='text-red-500 text-center'>{errors.Username?.message}</p>}
                        <Input
                            label="Password"
                            placeholder="Enter Your Password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        <h1 className='text-white font-bold text-center'>OR</h1>
                        <div onClick={signInWithGoogle}>
                        <Button text={'Continue with Google'} imgPath={googleLogo} />
                        </div>

                        {errors.password && <p className='text-red-500 text-center'>{errors.password?.message}</p>}
                        <Button text="Login" type="submit" style='text-white' />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
