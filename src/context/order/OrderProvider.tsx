"use client";

import { useEffect, useReducer, ReactNode } from "react";
import Cookie from "js-cookie";
import { BagContext } from "./OrderContext";
import { bagReducer } from "./orderReducer";

import { IOrden, IProductoOrden } from "@/interfaces";
import { hrApi } from "@/api";

export interface BagState {
  isLoaded: boolean;
  bag: IProductoOrden[];
  numberOfProducts: number;
  total: number;
}

const BAG_INITIAL_STATE: BagState = {
  isLoaded: false,
  bag: [],
  numberOfProducts: 0,
  total: 0,
};

export const BagProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(bagReducer, BAG_INITIAL_STATE);

  useEffect(() => {
    try {
      const localBag = localStorage.getItem("bag")
        ? JSON.parse(localStorage.getItem("bag")!)
        : [];
      const cookieBag = Cookie.get("bag") ? JSON.parse(Cookie.get("bag")!) : [];
      dispatch({ type: "LOAD_BAG", payload: localBag || cookieBag });
    } catch (error) {
      console.log(error);
      dispatch({ type: "LOAD_BAG", payload: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bag", JSON.stringify(state.bag));
    Cookie.set("bag", JSON.stringify(state.bag));
  }, [state.bag]);

  useEffect(() => {
    const numberOfProducts = state.bag.reduce(
      (acc, product) => acc + product.cantidad_orden,
      0
    );
    const total = state.bag.reduce(
      (acc, product) => acc + product.monto * product.cantidad_orden,
      0
    );
    const orderSummary = {
      numberOfProducts,
      total,
    };
    dispatch({ type: "UPDATE_ORDER_SUMMARY", payload: orderSummary });
  }, [state.bag]);

  const addProductToBag = async (product: IProductoOrden) => {
    const productInBag = state.bag.some(
      (item) => item.id_producto === product.id_producto
    );
    if (!productInBag) {
      return dispatch({
        type: "UPDATE_PRODUCTS_IN_BAG",
        payload: [...state.bag, product],
      });
    }

    const updatedBag = state.bag.map((item) => {
      if (item.id_producto !== product.id_producto) return item;
      item.cantidad_orden += product.cantidad_orden;
      return item;
    });
    console.log(updatedBag, "-------updatedBag-------");
    dispatch({ type: "UPDATE_PRODUCTS_IN_BAG", payload: updatedBag });
    console.log(state.bag, "-------bag-------");
  };

  const updateBagQuantity = (product: IProductoOrden) => {
    dispatch({ type: "CHANGE_BAG_QUANTITY", payload: product });
  };

  const removeBagProduct = async (product: IProductoOrden) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: product });
  };

  const clearBag = () => {
    dispatch({ type: "CLEAR_BAG", payload: [] });
  };

  const createOrder = async (id_cliente: number) => {
    const body: IOrden = {
      fecha_orden: new Date().toISOString(),
      hora_orden: new Date().toISOString(),
      monto_total: state.total,
      estado_orden: "PENDIENTE",
      productosOrden: state.bag,
      id_cliente,
    };

    const products = state.bag;

    try {
      const { data } = await hrApi.post("/cliente/order", { body, products });
      console.log(data);
      if (data.error) {
        return {
          hasError: true,
          message: data.message,
        };
      }
      dispatch({ type: "ORDER_COMPLETED" });
      return {
        hasError: false,
        message: "Orden creada con éxito",
      };
    } catch (error) {
      console.log(error);
      return {
        hasError: true,
        message: "Error no controlado, hable con el administrador",
      };
    }
  };

  return (
    <BagContext.Provider
      value={{
        ...state,
        addProductToBag,
        removeBagProduct,
        updateBagQuantity,
        clearBag,

        createOrder,
      }}
    >
      {children}
    </BagContext.Provider>
  );
};
