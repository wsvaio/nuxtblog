export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (query.page && query.limit) {
    let page = Number(query.page) || 1;
    let pageSize = Number(query.pageSize) || 10;

    return {
      page,
      pageSize,
      total: await db.tag.count(),
      list: await db.tag.findMany({
        skip: page * pageSize - 10,
        take: pageSize,
      }),
    };
  } else {
    return await db.tag.findMany();
  }
});
