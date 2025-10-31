import ContactForm from '@/components/contact-form'
import Rhf from '@/components/rhf'
import RhfWithZod from '@/components/rhf-with-zod'
import SimpleForm from '@/components/simple'
import RhfWithAction from '@/components/with-action'

export default function Home() {
  return (
    <section className='flex min-h-screen flex-col items-center justify-center'>
        {/* <SimpleForm /> */}
        {/* <Rhf /> */}
        {/* <RhfWithZod /> */}
        {/* <RhfWithAction /> */}
        <ContactForm />
    </section>
  )
}
