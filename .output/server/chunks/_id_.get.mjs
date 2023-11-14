import { d as defineEventHandler, a as getRouterParam } from './nitro/node-server.mjs';
import { d as db } from './index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '@prisma/client';

const _id__get = defineEventHandler(async (event) => {
  const id = +getRouterParam(event, "id");
  return db.article.findUnique({
    where: { id },
    include: {
      tags: true,
      type: true,
      comments: true
    }
  });
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
