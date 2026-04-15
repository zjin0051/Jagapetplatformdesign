import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export default async function handler(req: any, res: any) {
  try {
    const id = String(req.query.id || '').trim()

    if (!id) {
      return res.status(400).json({ error: 'Missing pet id' })
    }

    const petRows = await sql`
      select *
      from public.pet
      where pet_id = ${id}
      limit 1
    `

    if (petRows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' })
    }

    const pet = petRows[0]

    let relatedPets: any[] = []

    if (pet.pet_genus) {
      relatedPets = await sql`
        select *
        from public.pet
        where pet_id <> ${id}
          and pet_genus = ${pet.pet_genus}
        limit 3
      `
    } else if (pet.pet_family) {
      relatedPets = await sql`
        select *
        from public.pet
        where pet_id <> ${id}
          and pet_family = ${pet.pet_family}
        limit 3
      `
    }

    return res.status(200).json({ pet, relatedPets })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}