'use client'

import { useForm, SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ContactFormSchema } from '@/lib/schema'
import { sendEmail } from '@/app/_actions'
import { toast } from 'sonner'

export type ContactFormInputs = z.infer<typeof ContactFormSchema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(ContactFormSchema)
  })

  const processForm: SubmitHandler<ContactFormInputs> = async data => {
    const result = await sendEmail(data)

    if (result?.success) {
      console.log({ data: result.data })
      toast.success('Email sent!')
      reset()
      return
    }

    if (!result?.success) {
      console.log({ data: result?.data })
      toast.success(result?.warning || 'Email already exists!')
      reset()
      return
    }

    // toast error
    console.log(result?.error)
    toast.error('Something went wrong!')
  }

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className='mx-auto flex flex-1 flex-col items-center justify-center gap-4 text-gray-600 sm:w-1/2 lg:w-1/3'
    >
      <h1 className='mb-16 text-2xl text-black font-extrabold flex items-center justify-center'>WaitList</h1>

      <div className='w-full rounded-lg inpt bg-white'>
        <input
          placeholder='name'
          className=''
          {...register('name')}
        />
        {errors.name?.message && (
          <p className='ml-1 mt-1 text-sm text-red-400'>
            {errors.name.message}
          </p>
        )}
      </div>

      <div className='w-full rounded-lg inpt bg-white'>
        <input
          placeholder='email'
          className=''
          {...register('email')}
        />
        {errors.email?.message && (
          <p className='ml-1 mt-1 text-sm text-red-400'>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className='w-full rounded-lg inpt bg-white'>
        <textarea
          rows={5}
          cols={5}
          resize-none='true'
          placeholder='message'
          className=''
          {...register('message')}
        />
        {errors.message?.message && (
          <p className='ml-1 text-sm text-red-400'>{errors.message.message}</p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className='rounded-lg border border-black bg-black py-2.5 font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 w-full'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
