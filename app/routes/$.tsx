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

export let loader: LoaderFunction = async ({ params, request }) => {
  let url = new URL(request.url);
  let page = +(url.searchParams.get("page") || 1);
  const type = params["*"] || "top";
  const stories = await fetchAPI(`${mapStories[type as keyof mapStories]}?page=${page}`)

  return json({ type, stories, page });
};

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
