document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      
      // Clear and reset activity select dropdown
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create heading
        const heading = document.createElement("h4");
        heading.textContent = name;
        activityCard.appendChild(heading);

        // Create description
        const description = document.createElement("p");
        description.textContent = details.description;
        activityCard.appendChild(description);

        // Create schedule
        const schedule = document.createElement("p");
        const scheduleLabel = document.createElement("strong");
        scheduleLabel.textContent = "Schedule:";
        schedule.appendChild(scheduleLabel);
        schedule.appendChild(document.createTextNode(" " + details.schedule));
        activityCard.appendChild(schedule);

        // Create availability
        const availability = document.createElement("p");
        const availabilityLabel = document.createElement("strong");
        availabilityLabel.textContent = "Availability:";
        availability.appendChild(availabilityLabel);
        availability.appendChild(document.createTextNode(" " + spotsLeft + " spots left"));
        activityCard.appendChild(availability);

        // Create participants section
        const participantsLabel = document.createElement("p");
        const participantsStrong = document.createElement("strong");
        participantsStrong.textContent = "Participants:";
        participantsLabel.appendChild(participantsStrong);
        
        if (details.participants.length > 0) {
          activityCard.appendChild(participantsLabel);
          
          const participantsList = document.createElement("ul");
          participantsList.className = "participants-list";
          
          details.participants.forEach(email => {
            const listItem = document.createElement("li");
            
            const emailSpan = document.createElement("span");
            emailSpan.textContent = email;
            listItem.appendChild(emailSpan);
            
            const unregisterBtn = document.createElement("button");
            unregisterBtn.className = "unregister-btn";
            unregisterBtn.textContent = "取消注册";
            unregisterBtn.dataset.activity = name;
            unregisterBtn.dataset.email = email;
            listItem.appendChild(unregisterBtn);
            
            participantsList.appendChild(listItem);
          });
          
          activityCard.appendChild(participantsList);
        } else {
          participantsLabel.appendChild(document.createTextNode(" None yet"));
          activityCard.appendChild(participantsLabel);
        }

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        // Refresh activities to show updated participant list
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Use event delegation for unregister buttons
  activitiesList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("unregister-btn")) {
      const activityName = event.target.dataset.activity;
      const email = event.target.dataset.email;
      
      try {
        const response = await fetch(
          `/activities/${encodeURIComponent(activityName)}/unregister?email=${encodeURIComponent(email)}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (response.ok) {
          messageDiv.textContent = result.message;
          messageDiv.className = "success";
          // Refresh activities to show updated participant list
          fetchActivities();
        } else {
          messageDiv.textContent = result.detail || "An error occurred";
          messageDiv.className = "error";
        }

        messageDiv.classList.remove("hidden");

        // Hide message after 5 seconds
        setTimeout(() => {
          messageDiv.classList.add("hidden");
        }, 5000);
      } catch (error) {
        messageDiv.textContent = "Failed to unregister. Please try again.";
        messageDiv.className = "error";
        messageDiv.classList.remove("hidden");
        console.error("Error unregistering:", error);
      }
    }
  });

  // Initialize app
  fetchActivities();
});
