"use client";

import { useEffect, useReducer, ReactNode } from "react";
import Cookie from "js-cookie";
import { BagContext } from "./OrderContext";
import { bagReducer } from "./orderReducer";
import { IOrden, IProductoOrden, EstadoOrden, BagType } from "@/interfaces";
import { hrApi } from "@/api";

export interface BagState {
  isLoaded: boolean;
  bag: BagType;
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
      dispatch({ type: "LOAD_BAG", payload: localBag ?? cookieBag });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "LOAD_BAG",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bag", JSON.stringify(state.bag));
    Cookie.set("bag", JSON.stringify(state.bag));
  }, [state.bag]);

  useEffect(() => {
    const numberOfProducts = state.bag.reduce(
      (acc, item) =>
        acc +
        item.productos.reduce(
          (acc, product) => acc + product.cantidad_orden,
          0
        ),
      0
    );
    const total = state.bag.reduce(
      (acc, item) =>
        acc + item.productos.reduce((acc, product) => acc + product.monto, 0),
      0
    );
    const orderSummary = {
      numberOfProducts,
      total,
    };
    dispatch({ type: "UPDATE_ORDER_SUMMARY", payload: orderSummary });
  }, [state.bag]);

  const addProductToBag = async (product: IProductoOrden) => {
    console.log(state.bag);
    const productInBag = state.bag.some((item) =>
      item.id_negocio === product.lote?.inventario.id_negocio
        ? item.productos.some(
            (item) => item.id_producto === product.id_producto
          )
        : false
    );

    const productInNegocio = state.bag.some(
      (item) => item.id_negocio === product.lote?.inventario.id_negocio
    );

    if (!productInBag && !productInNegocio) {
      return dispatch({
        type: "UPDATE_PRODUCTS_IN_BAG",
        payload: [
          ...state.bag,
          {
            id_negocio: product.lote?.inventario.id_negocio!,
            nombre_negocio: product.lote?.inventario.negocio?.nombre_negocio!,
            total: product.cantidad_orden * product.producto?.lote?.precio_kg!,
            productos: [product],
          },
        ],
      });
    }

    const updatedBag = state.bag.map((item) => {
      if (item.id_negocio === product.lote?.inventario.id_negocio) {
        item.productos = item.productos.some(
          (item) => item.id_producto === product.id_producto
        )
          ? item.productos.map((item) => {
              if (item.id_producto === product.id_producto) {
                item.cantidad_orden += product.cantidad_orden;
                item.monto += product.monto;
              }
              return item;
            })
          : [...item.productos, product];
        item.total = item.productos.reduce(
          (acc, product) => acc + product.monto,
          0
        );
      }
      return item;
    }) as BagType;
    dispatch({ type: "UPDATE_PRODUCTS_IN_BAG", payload: updatedBag });
  };

  const updateBagQuantity = (product: IProductoOrden) => {
    dispatch({ type: "CHANGE_BAG_QUANTITY", payload: product });
  };

  const removeBagProduct = async (product: IProductoOrden) => {
    if (
      state.bag
        .map((item) => item.productos.length)
        .reduce((a, b) => a + b, 0) === 1
    ) {
      dispatch({ type: "CLEAR_BAG", payload: [] });
    }
    dispatch({ type: "REMOVE_PRODUCT", payload: product });
  };

  const clearBag = () => {
    dispatch({
      type: "CLEAR_BAG",
      payload: [],
    });
  };

  const createOrder = async (id_cliente: number, id_historial: number) => {
    const body = {
      fecha_orden: new Date().toISOString(),
      hora_orden: new Date().toISOString(),
      monto_subtotal: state.total,
      monto_total: state.total,
      estado_orden: EstadoOrden.PENDIENTE,
      id_cliente,
      id_historial,
      bag: state.bag,
    };

    try {
      const { data } = await hrApi.post("/cliente/order", { body });
      console.log(data);
      if (data.error) {
        return {
          hasError: true,
          message: data.message,
          data: {} as IOrden,
        };
      }
      dispatch({ type: "ORDER_COMPLETED" });
      return {
        hasError: false,
        message: "Orden creada con éxito",
        data: data as IOrden,
      };
    } catch (error) {
      console.log(error);
      return {
        hasError: true,
        message: "Error no controlado, hable con el administrador",
        data: {} as IOrden,
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
