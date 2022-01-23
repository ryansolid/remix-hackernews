import type { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import fetchAPI from "~/api";

export interface IUser {
  error: string;
  id: string;
  created: string;
  karma: number;
  about: string;
}

export let loader: LoaderFunction = async ({ params }) => {
  const user = await fetchAPI(`user/${params.id}`)
  return json({ user });
};

const User = () => {
  const { user } = useLoaderData<{ user: IUser }>();
  return (
    <div className="user-view">
      {user && user.error ? (
        <h1>User not found.</h1>
      ) : (
        <>
          <h1>User : {user.id}</h1>
          <ul className="meta">
            <li>
              <span className="label">Created:</span> {user.created}
            </li>
            <li>
              <span className="label">Karma:</span> {user.karma}
            </li>
            {user.about && (
              <li
                dangerouslySetInnerHTML={{ __html: user.about }}
                className="about"
              />
            )}
          </ul>
          <p className="links">
            <a href={`https://news.ycombinator.com/submitted?id=${user.id}`}>
              submissions
            </a>{" "}
            |{" "}
            <a href={`https://news.ycombinator.com/threads?id=${user.id}`}>
              comments
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default User;
