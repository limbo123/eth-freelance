import { useSelector, TypedUseSelectorHook } from "react-redux";
import { rootState } from "../redux/store";

export const useAppSelector: TypedUseSelectorHook<rootState> = useSelector