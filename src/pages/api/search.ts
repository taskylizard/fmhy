import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import Minisearch from "minisearch";

const ITEMS_PER_PAGE = 30;
const index = new Minisearch({
  fields: ['title', 'link', 'nsfw']
})
// index.addAll(await prisma.wiki.findMany())

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { q, nsfw, page } = req.query as {
    q: string;
    nsfw: string;
    page: string;
  };

  if (!q) {
    return res.status(400).json({ message: "Missing query", error: true });
  }

  const parsedPage = parseInt(page) || 1;
  const parsedNsfw = nsfw === "true" ? true : false;

  const searchWhereQuery = {
    title: {
      contains: q,
    },
    nsfw: parsedNsfw,
  };

  const results = await prisma.wiki.findMany({
    where: searchWhereQuery,
    skip: (parsedPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  const count = await prisma.wiki.count({
    where: searchWhereQuery,
  });

  res.status(200).json({ data: results, count });
}
