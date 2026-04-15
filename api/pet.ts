import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export default async function handler(req: any, res: any) {
  try {
    const id = String(req.query.id || '').trim()

    if (!id) {
      return res.status(400).json({ error: 'Missing pet id' })
    }

    const petRows = await sql`
      select
        pet_id,
        pet_scientific_name,
        pet_vernacular_name,
        pet_genus,
        pet_family,
        pet_body_shape,
        pet_traits,
        pet_max_length,
        pet_max_weight,
        pet_longevity,
        pet_habitat,
        pet_temperature,
        pet_ph_range,
        pet_water_hardness,
        pet_tank_size,
        pet_migration_type,
        pet_danger,
        pet_is_native,
        pet_comments,
        pet_aquarium
      from public.pet
      where pet_id = ${id}
      limit 1
    `

    if (petRows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' })
    }

    const pet = petRows[0]

    let relatedPets: any[] = []

    if (pet.pet_genus || pet.pet_family) {
      relatedPets = await sql`
        select
          pet_id,
          pet_scientific_name,
          pet_vernacular_name,
          pet_genus,
          pet_family,
          pet_body_shape,
          pet_traits,
          pet_max_length,
          pet_max_weight,
          pet_longevity,
          pet_habitat,
          pet_temperature,
          pet_ph_range,
          pet_water_hardness,
          pet_tank_size,
          pet_migration_type,
          pet_danger,
          pet_is_native,
          pet_comments,
          pet_aquarium
        from public.pet
        where pet_id <> ${id}
          and (
            (${pet.pet_genus} is not null and pet_genus = ${pet.pet_genus})
            or
            (${pet.pet_family} is not null and pet_family = ${pet.pet_family})
          )
        limit 3
      `
    }

    return res.status(200).json({ pet, relatedPets })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}