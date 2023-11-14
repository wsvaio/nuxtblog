import { d as defineEventHandler, g as getQuery } from './nitro/node-server.mjs';
import { d as db } from './index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '@prisma/client';

const _get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.page && query.limit) {
    let page = Number(query.page) || 1;
    let pageSize = Number(query.pageSize) || 10;
    return {
      page,
      pageSize,
      total: await db.comment.count(),
      list: await db.comment.findMany({
        skip: page * pageSize - 10,
        take: pageSize
      })
    };
  } else {
    return await db.comment.findMany();
  }
});

export { _get as default };
//# sourceMappingURL=.get2.mjs.map
