<script setup lang="ts">
interface SocialLink {
  icon: string
  url: string
}

interface TeamMember {
  name: string
  role: string
  avatar: string
  profileUrl: string
  socials: SocialLink[]
}

const team: TeamMember[] = [
  {
    name: 'Donny Lu',
    role: 'Mechanical Team, Caltech Robotics Team',
    avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQEnwhC9wfj15A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1681311801575?e=1756339200&v=beta&t=RMWsZf5qffak-DTJo3hUEGNGI5lEKtIaBsxVrlCNjxM',
    profileUrl: 'https://www.linkedin.com/in/rebnoob/',
    socials: [
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/rebnoob/' }
    ]
  },
  {
    name: 'Will C. Forte',
    role: 'Mechanical Team, Rutgers Dynamics',
    avatar: 'https://github.com/willcforte.png',
    profileUrl: 'https://willcforte.com',
    socials: [
      { icon: 'i-mdi-web', url: 'https://willcforte.com' },
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/willcforte/' },
      { icon: 'i-simple-icons-gmail', url: 'mailto:willcforte@gmail.com' },
      { icon: 'i-simple-icons-x', url: 'https://x.com/willcforte' },
      { icon: 'i-simple-icons-github', url: 'https://github.com/willcforte' },
    ]
  },
  {
    name: 'Ryan Rudes',
    role: 'Software Team, Caltech Robotic Manipulation Club',
    avatar: 'https://ryanrudes.com/src/pfp.png',
    profileUrl: 'https://www.linkedin.com/in/ryanrudes/',
    socials: [
      { icon: 'i-mdi-web', url: 'https://ryanrudes.com/' },
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/ryanrudes/' },
      { icon: 'i-simple-icons-gmail', url: 'mailto:ryanrudes@gmail.com' },
      { icon: 'i-simple-icons-github', url: 'https://www.github.com/ryanrudes' },
    ]
  },
  {
    name: 'Sarah Hong',
    role: 'Software Team, Columbia Robotics Club',
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQElrIeTR05OJQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1712402811023?e=1756339200&v=beta&t=CUpMBfw7Yvi9Sk-8xVSXSvRrWvhD3Fdh4bYFuiBVoYI',
    profileUrl: 'https://www.linkedin.com/in/sarah-soohyun-hong/',
    socials: [
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/sarah-soohyun-hong/' }
    ]
  },
  {
    name: 'Alex Tong',
    role: 'Software Team, UC Berkeley',
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQGZ0v6uIWxPsQ/profile-displayphoto-shrink_200_200/B56ZRoeTSUHoAY-/0/1736919562261?e=1756339200&v=beta&t=Rzw9THa5pfic1oYfBxoTyfvutOipXUhcVrJlz4dEgLg',
    profileUrl: 'https://www.linkedin.com/in/alextong1010/',
    socials: [
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/alextong1010/' }
    ]
  },
  {
    name: 'Nikhil Vijay',
    role: 'Mechanical Team, Rutgers University',
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQGsosYXjz3Big/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1684717421976?e=1756339200&v=beta&t=9lEFPAQJrt_ql0eRe4SUsMvNgcSMVq1HW1ZMOPUCK-Y',
    profileUrl: 'https://www.linkedin.com/in/nikhil-k-vijay/',
    socials: [
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/nikhil-k-vijay/' }
    ]
  },
  {
    name: 'Maxx Ibarra',
    role: 'Mechanical Team, Caltech Alum',
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQHWgInv3_85HA/profile-displayphoto-scale_200_200/B56ZetX.ptGQAg-/0/1750960436156?e=1756339200&v=beta&t=FeP7Y1x2bLADuG5kLPx2iJR2lN7PfCV8YscCLB_vBZY',
    profileUrl: 'https://www.linkedin.com/in/maxx-ibarra-2b5181168/',
    socials: [
      { icon: 'i-simple-icons-linkedin', url: 'https://www.linkedin.com/in/maxx-ibarra-2b5181168/' }
    ]
  }
]

// // Partners data
// const partners = [
//   {
//     name: 'Caltech',
//     logo: '/logos/Seal_of_the_California_Institute_of_Technology.svg',
//     clubs: ['Caltech Robotics Team', 'Robotic Manipulation Club'],
//     url: 'http://crt.caltech.edu/'
//   },
//   {
//     name: 'Columbia',
//     logo: '/logos/Columbia_coat_of_arms_no_crest.svg',
//     clubs: ['Columbia University Robotics Club'],
//     url: 'https://www.columbiarobotics.club/'
//   },
//   {
//     name: 'Berkeley',
//     logo: '/logos/Seal_of_University_of_California,_Berkeley.svg',
//     clubs: ['Alex Tong'],
//     url: 'https://berkeley.edu'
//   },
//   {
//     name: 'Rutgers',
//     logo: '/logos/Rutgers_Shield.svg', // replace with actual path or URL
//     clubs: ['Rutgers Dynamics'],
//     url: 'https://rutgers.edu'
//   },
//   {
//     name: 'Stanford',
//     logo: '/logos/block-s-right.png',
//     clubs: ['Stanford Student Robotics'],
//     url: 'https://stanfordstudentrobotics.org/'
//   }
// ]
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-4xl font-bold mb-8 text-center">Meet Our Team</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <ULink v-for="member in team"
        :key="member.name" :to="member.profileUrl" target="_blank">
        <UCard
          class="text-center p-6 flex flex-col items-center transform transition-all duration-500 ease-in-out
          hover:scale-105 hover:shadow-xl hover:-translate-y-1"
        >
          <ULink :to="member.profileUrl" target="_blank">
            <UAvatar :src="member.avatar" :alt="member.name" size="4xl" class="mx-auto mb-4 w-50 h-50" />
          </ULink>

          <p class="font-semibold">{{ member.name }}</p>
          <p class="text-sm text-gray-500">{{ member.role }}</p>

          <div class="mt-2 flex justify-center gap-3">
            <ULink
              v-for="(social, i) in member.socials"
              :key="i"
              :to="social.url"
              target="_blank"
            >
              <UIcon :name="social.icon" class="text-primary w-5 h-5" />
            </ULink>
          </div>
        </UCard>
      </ULink>
    </div>
  </UContainer>

  <UContainer class="py-12">
    <h2 class="text-4xl font-bold mb-8 text-center">Team Affiliates</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
      <ULink v-for="partner in partners"
        :key="partner.name" :to="partner.url" target="_blank">
        <UCard
          class="text-center p-6 flex flex-col items-center transform transition-all duration-500 ease-in-out
          hover:scale-105 hover:shadow-xl hover:-translate-y-1"
        >
          <img
            :src="partner.logo"
            :alt="partner.name + ' logo'"
            class="mb-4 h-30 w-auto object-contain mx-auto"
          />

          <p class="font-semibold">{{ partner.name }}</p>
          <p class="text-sm text-gray-500">
            <template v-for="(club, i) in partner.clubs" :key="club">
              {{ club }}<span v-if="i < partner.clubs.length - 1"> &amp; </span>
            </template>
          </p>
        </UCard>
      </ULink>
    </div>
  </UContainer>
</template>
