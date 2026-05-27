import {revalidatePath, revalidateTag} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({message: 'Invalid secret'}, {status: 401})
  }

  revalidateTag('siteSettings')
  revalidatePath('/', 'layout')

  return NextResponse.json({revalidated: true, now: Date.now()})
}
