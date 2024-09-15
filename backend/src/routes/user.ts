import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signupInput, signinInput} from "@kamal-02/blog-hub"

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body)
  if(!success){
    c.status(411)
    return c.json({
      msg: "Invalid inputs"
    })
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    console.log(user);
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      token: token,
    });
  } catch (error) {
    console.log(error);
    c.status(403);
    return c.json({
      error: "Error while signing up",
    });
  }
});

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if(!success){
    c.status(403)
    return c.json({
      msg: "Invalid inputs"
    })
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return c.json({
        msg: "User not found",
      });
    }
    console.log(user)
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      token: token,
    });
  } catch (error) {
    console.log(error);
    c.status(403);
    return c.json({
      error: "Error while signing up",
    });
  }
});
