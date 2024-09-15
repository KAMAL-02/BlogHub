import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono} from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, CreateBlogInput, updateBlogInput } from "@kamal-02/blog-hub";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string,
    }
}>();

blogRouter.use('/*', async(c, next)=>{

    const jwt = c.req.header("Authorization")|| ""
    if(!jwt){
        return c.json({
            msg: "Invalid/Unauthorised"
        })
    }
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET)
    if(!payload.id){
        c.status(401)
        return c.json({
            msg: "Invalid/Unauthorised"
        })
    }else{
        //@ts-ignore
        c.set('userId', payload.id)
        await next();
    }
})

blogRouter.post("/", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const body = await c.req.json();
      const authorId = c.get('userId')

      const {success} = createBlogInput.safeParse(body);
      if(!success){
        c.status(411)
        return c.json({
            msg: "Invalid inputs"
        })
      }

      const authorExists = await prisma.user.findUnique({
        where: { id: authorId },
      });
      
      if (!authorExists) {
        throw new Error('Author not found');
      }
      try {
        const post = await prisma.post.create({
            data:{
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })

        if(!post.id){
            return c.json({
                msg: "Post not created"
            })
        }

        return c.json({
            id: post.id
        })
      } catch (error) {
        console.log(error)
        c.status(403)
        return c.json({
            msg: "Error creating posts"
        })
      }
});

blogRouter.put("/", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

      const body = await c.req.json();
      const userId= c.get('userId')
      const { success } = updateBlogInput.safeParse(body);
      if(!success){
        c.status(403);
        return c.json({
            msg: "Invalid inputs"
        })
      }

      try {
        const post = await prisma.post.update({
            where:{
                id: body.id,
                authorId: userId
            },
            data:{
                title: body.title,
                content: body.content
            }
        })

        if(!post){
            return c.json({
                msg: "Post not updated"
            })
        }
        return c.json({
            msg: "Post updated",
            id: post.id
        })
      } catch (error) {
        console.log(error)
        c.status(403)
        return c.json({
            msg: "Error updating post"
        })
      }
});

blogRouter.get("/bulk", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

      try {
        const posts = await prisma.post.findMany({});

        return c.json({
            posts
        })
      } catch (error) {
        console.log(error);
        c.status(403)
        return c.json({
            msg: "Error getting posts"
        })
      }
});

blogRouter.get("/:id", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

    const id = c.req.param('id');
    try {
        const post = await prisma.post.findUnique({
            where:{
                id
            }
        })
        return c.json({
            post
        })
    } catch (error) {
        console.log(error);
        c.status(403)
        return c.json({
            msg: "Error getting the post"
        })
    }
});