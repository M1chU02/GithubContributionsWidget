let username = "";

document.getElementById("fetchButton").addEventListener("click", () => {
  username = document.getElementById("usernameInput").value.trim();
  if (username) {
    fetchContributions();
  } else {
    alert("Please enter a valid GitHub username");
  }
});

async function fetchContributions() {
  const token = "";

  const query = `{
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const contributions =
      result.data.user.contributionsCollection.contributionCalendar.weeks;
    renderContributions(contributions);
    updateProfileLink();
  } catch (error) {
    console.error("Error fetching contributions:", error);
    alert(`Error: ${error.message}`);
  }
}

function renderContributions(weeks) {
  const usernameEl = document.getElementById("username");
  usernameEl.innerText = username;

  const grid = document.getElementById("contributionsGrid");
  grid.innerHTML = "";

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";

      if (day.contributionCount > 0) {
        const level = getContributionLevel(day.contributionCount);
        gridItem.classList.add(`level-${level}`);
      }

      gridItem.title = `${day.date}: ${day.contributionCount} contributions`;
      grid.appendChild(gridItem);
    });
  });
}

function getContributionLevel(contributionCount) {
  if (contributionCount >= 20) return 4;
  if (contributionCount >= 10) return 3;
  if (contributionCount >= 5) return 2;
  if (contributionCount >= 1) return 1;
  return 0;
}

// Add this function at the end of your script.js file
function updateProfileLink() {
  const profileLink = document.getElementById("profileLink");
  profileLink.href = `https://github.com/${username}`;
  profileLink.style.display = username ? "inline" : "none";
}
