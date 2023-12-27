export const host = `http://localhost:3000`;

export const uid = `abc123`;

export const generateUrlPayload = ({
  description,
}: {
  description?: null;
}) => ({
  id: 1,
  title: 'Google',
  description: description === null ? null : 'A search engine',
  redirect: 'http://google.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  url: `${host}/${uid}`,
});

export const generateUrlArray = () => [
  {
    id: 1,
    title: 'Google',
    description: 'A search engine',
    redirect: 'http://google.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    url: `${host}/${uid}`,
  },
  {
    id: 2,
    title: 'Facebook',
    description: 'A social media platform',
    redirect: 'http://facebook.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    url: `${host}/facebook-unique-id`,
  },
  {
    id: 3,
    title: 'Twitter',
    description: 'A social media platform',
    redirect: 'http://x.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    url: `${host}/x-unique-id`,
  },
];
