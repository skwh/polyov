module ApplicationHelper
  def current_tab(controller, page, all_pages)
    if (all_pages and controller === controller_name) or (page === action_name and controller === controller_name)
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
end
