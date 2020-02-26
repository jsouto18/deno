// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
const { args, readFileSync, writeFileSync, exit } = Deno;

const name = args[0];
const test: { [key: string]: Function } = {
  read(files: string[]): void {
    files.forEach(file => readFileSync(file));
  },
  write(files: string[]): void {
    files.forEach(file =>
      writeFileSync(file, new Uint8Array(0), { append: true })
    );
  },
  netFetch(hosts: string[]): void {
    hosts.forEach(host => fetch(host));
  },
  netListen(hosts: string[]): void {
    hosts.forEach(hostname => {
      const listener = Deno.listen({ transport: "tcp", hostname, port: 4541 });
      listener.close();
    });
  },
  async netDial(hosts: string[]): Promise<void> {
    for (const hostname of hosts) {
      const listener = await Deno.connect({
        transport: "tcp",
        hostname,
        port: 4541
      });
      listener.close();
    }
  }
};

if (!test[name]) {
  console.log("Unknown test:", name);
  exit(1);
}

test[name](args.slice(2));
