import type { LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";

import type { IStory } from "../types";
import Story from "../components/story";
import fetchAPI from "~/api";

interface StoriesData {
  page: number;
  type: string;
  stories: IStory[];
}

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs",
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ params, request }) => {
  let url = new URL(request.url);
  let page = +(url.searchParams.get("page") || 1);
  const type = "top"
  const stories = await fetchAPI(`news?page=${page}`)

  return json({ type, stories, page });
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let { page, type, stories } = useLoaderData<StoriesData>();

  return (
    <div className="news-view">
      <div className="news-list-nav">
        {page > 1 ? (
          <Link
            className="page-link"
            to={`/${type}?page=${page - 1}`}
            aria-label="Previous Page"
          >
            {"<"} prev
          </Link>
        ) : (
          <span className="page-link disabled" aria-disabled="true">
            {"<"} prev
          </span>
        )}
        <span>page {page}</span>
        {stories && stories.length >= 29 ? (
          <Link
            className="page-link"
            to={`/${type}?page=${page + 1}`}
            aria-label="Next Page"
          >
            more {">"}
          </Link>
        ) : (
          <span className="page-link disabled" aria-disabled="true">
            more {">"}
          </span>
        )}
      </div>
      <main className="news-list">
        {stories && (
          <ul>
            {stories.map((story) => (
              <Story key={story.id} story={story} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
