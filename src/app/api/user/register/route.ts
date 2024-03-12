import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

import { jwt } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function registerUser(req: NextApiRequest) {
  const {
    email = "",
    password = "",
    tipo = "",
    nombre = "",
    apellidos = "",
    fecha_nacimiento = "",
    nombreNegocio = "",
    telefono = "",
    calle = "",
    colonia = "",
    cp = "",
  } = (await new Response(req.body).json()) as {
    email: string;
    password: string;
    tipo: string;
    nombre: string;
    apellidos: string;
    fecha_nacimiento: string;
    nombreNegocio: string;
    telefono: string;
    calle: string;
    colonia: string;
    cp: string;
  };

  try {
    const emailAlreadyExist = await prisma.m_user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailAlreadyExist) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "Este correo ya esta registrado",
        },
        { status: 500 }
      );
    }

    if (tipo === "cliente") {
      const newUser = await prisma.m_user.create({
        data: {
          email,
          password: await hash(password, 10),
          id_rol: 3,
          cliente: {
            create: [
              {
                nombre_cliente: nombre,
                apellidos_cliente: apellidos,
                telefono_cliente: telefono,
                fecha_nacimiento: new Date(fecha_nacimiento),
                nombre_negocio: nombreNegocio || "",
                direccion_negocio: calle.concat(", ", colonia, ", ", cp) || "",
              },
            ],
          },
        },
      });
      const { id } = newUser;

      const token = jwt.signToken(id, email);
      return NextResponse.json(
        {
          token,
          user: {
            email,
          },
        },
        { status: 201 }
      );
    }

    if (tipo === "negocio") {
      const newUser = await prisma.m_user.create({
        data: {
          email,
          password: await hash(password, 10),
          id_rol: 2,
          duenonegocio: {
            create: [
              {
                nombre_dueneg: nombre,
                apellidos_dueneg: apellidos,
                fecha_nacimiento: new Date(fecha_nacimiento),
                negocio: {
                  create: {
                    nombre_negocio: nombreNegocio,
                    telefono_negocio: telefono,
                    direccion_negocio: calle.concat(", ", colonia, ", ", cp),
                    inventario: {
                      create: {},
                    },
                  },
                },
              },
            ],
          },
        },
      });
      const { id } = newUser;

      const token = jwt.signToken(id, email);
      return NextResponse.json(
        {
          token,
          user: {
            email,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Error al crear el usuario",
      },
      { status: 500 }
    );
  }
}
export { registerUser as POST };