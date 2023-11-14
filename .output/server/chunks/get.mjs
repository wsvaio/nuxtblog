import { d as defineEventHandler, g as getQuery } from './nitro/node-server.mjs';
import { d as db } from './index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '@prisma/client';

const get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.page && query.limit) {
    let page = Number(query.page) || 1;
    let pageSize = Number(query.pageSize) || 10;
    return {
      page,
      pageSize,
      total: await db.file.count(),
      list: await db.file.findMany({
        skip: page * pageSize - 10,
        take: pageSize,
        select: {
          id: true,
          name: true,
          size: true,
          type: true,
          lastModified: true,
          data: false,
          createAt: true,
          updateAt: true
        }
      })
    };
  } else {
    return await db.file.findMany({
      select: {
        id: true,
        name: true,
        size: true,
        type: true,
        lastModified: true,
        data: false,
        createAt: true,
        updateAt: true
      }
    });
  }
});

export { get as default };
//# sourceMappingURL=get.mjs.map