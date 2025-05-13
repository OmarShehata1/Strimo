import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

function OnboardingPage() {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const generateRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };
  return (
    <div className="min-h-screen bg-base-100 p-4 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-base-200 rounded-xl p-6 shadow-lg">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center justify-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Create Your Profile
          </h1>
          <div className="avatar mb-3">
            <div className="w-24 h-24 rounded-full bg-base-100 overflow-hidden">
              {formState.profilePic ? (
                <img src={formState.profilePic} alt="Profile" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-4xl text-primary">
                  <CameraIcon className="size-12 text-base-content opacity-40" />
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-accent btn-sm gap-2"
            onClick={generateRandomAvatar}
          >
            <ShuffleIcon className="size-4 mr-2" />
            Generate Random Avatar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              className="input input-bordered w-full"
              value={formState.fullName}
              onChange={(e) =>
                setFormState({ ...formState, fullName: e.target.value })
              }
              required
            />
          </div>

          {/* Bio */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Tell others about yourself and your language learning goals"
              value={formState.bio}
              onChange={(e) =>
                setFormState({ ...formState, bio: e.target.value })
              }
            ></textarea>
          </div>

          {/* Language Selection - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Native Language */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Native Language</span>
              </label>
              <select
                className="select select-bordered w-full"
                name="nativeLanguage"
                value={formState.nativeLanguage}
                onChange={(e) =>
                  setFormState({ ...formState, nativeLanguage: e.target.value })
                }
                required
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Language */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Learning Language</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formState.learningLanguage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    learningLanguage: e.target.value,
                  })
                }
                required
              >
                <option disabled value="">
                  Select language you're learning
                </option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <div className="relative">
              <MapIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                className="input input-bordered w-full rounded-l-none pl-10"
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full gap-2"
            disabled={isPending}
          >
            {!isPending ? (
              <>
                <ShipWheelIcon className="size-5 mr-2" />
                Complete Onboarding
              </>
            ) : (
              <>
                <LoaderIcon className="animate-spin size-5 mr-2" />
                Onboarding...
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;
