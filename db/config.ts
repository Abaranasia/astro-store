import { column, defineDb } from 'astro:db';
import { defineTable } from 'node_modules/@astrojs/db/dist/_internal/runtime/virtual';

const User =defineTable({
  columns: {
    id: column.text( { primaryKey: true, unique: true } ),
    name: column.text(),
    email: column.text( { unique: true } ),
    password: column.text(),
    createdAt: column.date( { default: new Date() } ),
    role: column.text( { references: () => Role.columns.id} ), // reference to Role table; admin, user, etc
  }
});

const Role = defineTable( {
  columns: {
    id: column.text( { primaryKey: true, unique: true } ),
    name: column.text(),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Role,
  }
});
