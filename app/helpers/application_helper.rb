module ApplicationHelper
  def title_helper(title)
    if title.blank?
      "Polyov"
    else
      "Polyov | #{title}"
    end
  end

  def default_meta_tags
		{
			title: "Polyov",
			description: "Web & UI Design, Development",
			keywords: "Web Design, Web Development, UX Design, UI Design, Ruby on Rails, Ruby, Javascript",
			separator: ","
		}
	end

  def current_tab(controller, page, all_pages)
    if (all_pages and controller === controller_name) or (page === action_name and controller === controller_name) or (controller_name == "static" and controller == "projects" and action_name == "index" and page == "index")
      "current-tab"
    else
      controller_name
    end
  end

  def homepage_size
    if action_name === "index" or action_name === "about"
      "large"
    else
      "small"
    end
  end

  def limit_length(text, words)
    text.split(" ").slice(0,words).join(" ") << "..."
  end
end
