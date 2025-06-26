document.addEventListener('DOMContentLoaded', function() {
  // Deliverable 1: Initialize the App
  const jobsGrid = document.getElementById('jobs');
  const noJobs = document.getElementById('nojobs');
  const region = document.getElementById('region');
  const industry = document.getElementById('industry');
  const search = document.getElementById('search');

  // Deliverable 2: Fetch Job Data
  function fetchJobs() {
    jobsGrid.innerHTML = '<p>Loading jobs...</p>';
    noJobs.style.display = 'none';

    let url = 'https://jobicy.com/api/v2/remote-jobs?count=10';
    if (region.value !== 'all') {
      url = url + '&geo=' + region.value;
    }
    if (industry.value !== 'all') {
      url = url + '&industry=' + industry.value;
    }
    if (search.value !== '') {
      url = url + '&tag=' + search.value;
    }

    fetch(url)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('API not working');
        }
      })
      .then(function(data) {
        renderJobs(data.jobs);
      })
      .catch(function() {
        // Fallback to db.json
        fetch('db.json')
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            renderJobs(data.jobs);
          })
          .catch(function() {
            jobsGrid.innerHTML = '<p>Error: Could not load jobs!</p>';
          });
      });
  }

  // Deliverable 3: Render Jobs
  function renderJobs(jobs) {
    jobsGrid.innerHTML = '';
    noJobs.style.display = 'none';

    if (jobs.length === 0) {
      noJobs.style.display = 'block';
      return;
    }

    for (let i = 0; i < jobs.length; i++) {
      let job = jobs[i];
      let jobDiv = document.createElement('div');
      jobDiv.className = 'job-card';

      let logo = '';
      if (job.companyLogo) {
        logo = '<img src="' + job.companyLogo + '">';
      }

      jobDiv.innerHTML = logo +
        '<h2>' + job.jobTitle + '</h2>' +
        '<p>' + job.companyName + '</p>' +
        '<p>Location: ' + job.jobGeo + '</p>' +
        '<p>Type: ' + job.jobType + '</p>' +
        '<p>Industry: ' + job.jobIndustry + '</p>' +
        '<p>' + job.jobExcerpt + '</p>' +
        '<a href="' + job.url + '">Apply</a>';

      jobsGrid.appendChild(jobDiv);
    }
  }

  // Deliverable 4: Handle User Input
  function setupEventListeners() {
    region.addEventListener('change', function() {
      fetchJobs();
    });
    industry.addEventListener('change', function() {
      fetchJobs();
    });
    search.addEventListener('input', function() {
      fetchJobs();
    });
  }

  // Deliverable 5: Manage Errors and Empty States
  // (Handled within fetchJobs and renderJobs)

  // Initialize
  setupEventListeners();
  fetchJobs();
});