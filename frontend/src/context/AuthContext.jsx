import { createContext, useContext, useState, useEffect } from "react";
import loginApi from "../services/auth.service.js";

const AuthContext = createContext(null);

const user = localStorage.getItem("user");
