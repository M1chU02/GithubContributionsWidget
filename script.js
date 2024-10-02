const username = "M1chU02";
const token = "";

async function fetchContributions() {
  const query = `
    {
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    const contributions =
      result.data.user.contributionsCollection.contributionCalendar.weeks;
    renderContributions(contributions);
  } catch (error) {
    console.error("Error fetching contributions:", error);
  }
}

function renderContributions(weeks) {
  const usernameEl = document.getElementById("username");
  usernameEl.innerText = username;
  const grid = document.getElementById("contributionsGrid");

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";

      if (day.contributionCount > 0) {
        const level = getContributionLevel(day.contributionCount);
        gridItem.classList.add(`level-${level}`);
      }

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

fetchContributions();
