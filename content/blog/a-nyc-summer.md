---
title: A NYC Summer
description: A summer spent building an open‑source modular robot with CCBR—from ICRA beginnings to weekends at Columbia, RL groundwork, and DIY actuators.
date: 2025-09-02
tags:
    - goals
    - summer 2025
    - retrospective
    - icra
author: Sarah Hong
cover: /blog-images/chinatown.jpg
---
## The beginning: ICRA friends
My summer with CCBR started off with a text from Donny, asking if we would be interested in working on an "open source humanoid robot." It was our ICRA group chat, which we'd used to coordinate meetups/dinners with during the conference week—consisting of students across Caltech, Columbia, Berkeley, Rutgers, and others. I said sure.

### What modular means to us
After a couple of calls, we landed on a shared vision for modularity—and spent some time defining what "modular" means to us. We decided that
- Modular does *not* necessarily mean a dog which can transform into a human (out of different motor requirements)
- Rather, modular means we take care into designing easily customizable joint interfaces, and a software framework with plug and play motor configurations

### On creating an open source robotics community
And that the broader goal and impetus of the project would be to address the lack of undergraduate-level quadruped and humanoid projects. We wanted to build a detailed, well-documented open source project for others to easily modify and build off, with the goal of creating an open source community around embodied robotics.

## Weekends at Columbia
So, those of us on the East Coast started meeting up on weekends over at Columbia's Makerspace to start working on this ambition.

### The CS majors try CAD-ing
The first two weeks, it was just me, Ryan, and Will CAD-ing it up. After multiple skirmishes over CADing softwares, we decided Fusion would be the choice balancing accessibility and usability. (The scale goes: Onshape, Fusion, Solidworks)

Unfortunately, Ryan and I are CS majors, and neither of us had CAD-ed something to this extent in a while. While Will (a dedicated MechE major) was tinkering around with his power supply, Ryan and I spent 10 hours poking around over a hip and thigh adaptor. Eventually, Will stepped in and fully took over CADing the rest of the leg assembly. (Probably out of pity.)

### The makings of our software foundations
So while we were waiting for Will to finish on the CAD, Ryan and I spent the next few weeks preparing everything on the software side; We wanted to start training walking policies as soon our leg assembly was complete.

### The development environment
We first spent some time setting up the development environment. After definitively choosing to use Isaac Lab over Mujoco for its robust suite of RL parallelization tools, we spent a day learning the different components of what go into the Isaac Lab simulation.
- I was graciously given a lab computer with an NVIDIA 4080 which I could Parsec into, so we downloaded Isaac Lab onto that, and tested out a couple of pre-baked RL examples.
- It was satisfying to see our dog army slowly and creepily learn how to march.

![[quadrupeds-in-isaaclab.jpeg]]

### RL theory: Unboxing the black box
This day, I also offhandedly showed Ryan a cool diffusion flow matching paper I saw; so the next week, I was shocked to hear he'd fully caught up on the diffusion literature up until 2021. He brushed it off, saying he'd been meaning to read up on diffusion anyways.

He was coming in with previous RL experience, and told me how reading up on the theory (and at least memorizing major results and theorems) helps you not go crazy while training a policy. He warned me that if we never uncover the black box behind the algorithms, it can become a frustrating gambling game in fine tuning. 

That day, Ryan also gave an "intro to reinforcement learning" lecture to me and Will, going over the derivation for the vanilla policy gradient, well as sharing his derivation for the PPO algorithm we were going to use to train our dog.

### Side quest: DIY actuators?
Also: As a side quest to learn more about how motors really work, we decided to 3D print and handwind our own actuators (following [this very detailed guide by Nachum Twersky](https://www.instructables.com/3D-Printed-QDD-Robotic-Actuator-MIT-Mini-Cheetah-C/)).

![](/blog-images/actuators.jpg)

## On new beginnings

### New year, new challenges
Our leg is almost done! The CAD models are done, and all the essential parts—motors, controllers, are shipped and ready to be assembled. We have a lot more work to do in documentation and software to setup the kind of clear framework we envisioned would allow others to easily build off. But as school starts back up, we'll have to think more critically on how this project will interface with the new members from our respective robotics clubs anyways; which I think could serve as a trial-by-fire in seeing how easily our documentation can stand for itself.

On the whole, my summer with CCBR has been super rewarding, and has shown me how strong a compelling vision can be. And I can't wait to finally see this dog come together.