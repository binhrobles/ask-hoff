FROM hayd/deno-lambda

COPY index.ts .
RUN deno cache index.ts

CMD ["index.handler"]
