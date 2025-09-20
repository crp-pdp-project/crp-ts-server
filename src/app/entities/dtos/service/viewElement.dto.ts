import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const TitleDTOSchema = z
  .object({
    title: z.object({
      text: z.string().min(1),
    }),
  })
  .openapi({
    description: 'Title element for a view',
    example: { title: { text: 'any title' } },
  });
export type TitleDTO = z.infer<typeof TitleDTOSchema>;
export type TitleDataDTO = TitleDTO['title'];

export const SubTitleDTOSchema = z
  .object({
    subTitle: z.object({
      text: z.string().min(1),
    }),
  })
  .openapi({
    description: 'Sub Title element for a view',
    example: { title: { text: 'any sub title' } },
  });
export type SubTitleDTO = z.infer<typeof SubTitleDTOSchema>;
export type SubTitleDataDTO = SubTitleDTO['subTitle'];

export const ParagraphDTOSchema = z
  .object({
    paragraph: z.object({
      text: z.string().min(1),
    }),
  })
  .openapi({
    description: 'Paragraph element for a view',
    example: { title: { text: 'any paragraph' } },
  });
export type ParagraphDTO = z.infer<typeof ParagraphDTOSchema>;
export type ParagraphDataDTO = ParagraphDTO['paragraph'];

export const BulletsDTOSchema = z
  .object({
    bullets: z.object({
      items: z.array(z.string().min(1)).min(1),
    }),
  })
  .openapi({
    description: 'Bullets element for a view',
    example: { title: { items: ['any bullet'] } },
  });
export type BulletsDTO = z.infer<typeof BulletsDTOSchema>;
export type BulletsDataDTO = BulletsDTO['bullets'];

export const ImageDTOSchema = z
  .object({
    image: z.object({
      path: z.url(),
    }),
  })
  .openapi({
    description: 'Image element for a view',
    example: { path: { text: 'https://...' } },
  });
export type ImageDTO = z.infer<typeof ImageDTOSchema>;
export type ImageDataDTO = ImageDTO['image'];

export const ViewElementDTOSchema = z.union([
  TitleDTOSchema,
  ParagraphDTOSchema,
  BulletsDTOSchema,
  SubTitleDTOSchema,
  ImageDTOSchema,
]);

export type ViewElementDTO = z.infer<typeof ViewElementDTOSchema>;
