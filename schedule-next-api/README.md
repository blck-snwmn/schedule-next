# Execute query(local)
```bash
$ pnpm wrangler d1 execute schedule-next-db --local --command="SELECT * from schedules where event_id='dfde54c
2-cfe8-4cf9-9a18-1856de8692ec'" 
```

# Migration
## Generate
```bash
$ pnpm drizzle-kit generate
```

## Apply(local)
```bash
$ pnpm wrangler d1 migrations apply schedule-next-db --local
```

## Apply(remote)
```bash
$ pnpm wrangler d1 migrations apply schedule-next-db --remote
```
