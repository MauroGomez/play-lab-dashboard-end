import { z } from 'zod';

const PriceField = z.coerce
  .number()
  .gt(0, { message: 'Please enter a price greater than $0.' })
  .transform((price) => Math.round(price * 100));

export const MovieFormSchema = z.object({
  title: z.string().nonempty({ message: 'Please enter a title.' }),
  director: z.string().nonempty({ message: 'Please enter a director.' }),
  genre: z.string().nonempty({ message: 'Please enter a genre.' }),
  release_year: z.coerce
    .number()
    .int()
    .min(1888, { message: 'Please enter a valid release year.' }),
  rating: z.string().nonempty({ message: 'Please enter a rating.' }),
  duration_minutes: z.coerce
    .number()
    .int()
    .gt(0, { message: 'Please enter a duration greater than 0.' }),
  purchase_price: PriceField,
  rental_price: PriceField,
  status: z.enum(['available', 'draft', 'archived'], {
    invalid_type_error: 'Please select a movie status.',
  }),
});

export type MovieFormInput = z.input<typeof MovieFormSchema>;
export type MovieFormData = z.output<typeof MovieFormSchema>;
export type MovieFormErrors = Partial<Record<keyof MovieFormInput, string[]>>;

type ValidateMovieResult =
  | {
      success: true;
      data: MovieFormData;
      fieldErrors: MovieFormErrors;
      message: null;
    }
  | {
      success: false;
      data: null;
      fieldErrors: MovieFormErrors;
      message: string;
    };

export function validateMovie(input: unknown): ValidateMovieResult {
  const result = MovieFormSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      data: null,
      fieldErrors: result.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  return {
    success: true,
    data: result.data,
    fieldErrors: {},
    message: null,
  };
}
