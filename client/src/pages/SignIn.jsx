import React from 'react';
import { Logo, Button, Input } from "../components/index.js";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '../redux/useSlice.js';
import { errorParser } from '../utils/errorParser.js';
import { useLoadingContext } from '../contexts/LoadingContext.jsx';
const SignIn = () => {
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch()
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const {setIsLoading}=useLoadingContext()

    const login = async (data, event) => {
        event.preventDefault();
        dispatch(loginStart())
        setError("");
        setIsLoading(true)
        try {
            const userData = await axios.post(`${backendURL}/user/login`, data);
            sessionStorage.setItem('refreshToken', userData.data.data.refreshToken)
            dispatch(loginSuccess(userData.data.data))
            navigate("/")

        } catch (error) {
            setError(errorParser(error));
        }
        finally{
            setIsLoading(false)
        }
    };

    return (
        <div className="flex">
            <div className={`mx-auto w-full max-w-lg bg-custom-gray-2 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" textColor='text-black' />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-black">Sign up to create an account</h2>
                <p className="mt-2 text-center text-base text-black">
                    Don't have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-black italic transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)}>
                    <div className='space-y-5'>
                        <Input
                            label="Username"
                            placeholder="Enter Username "
                            {...register("username", {

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

                        {errors.password && <p className='text-red-500 text-center'>{errors.password?.message}</p>}
                        <Button style='w-full bg-black text-white'> Sign In</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
