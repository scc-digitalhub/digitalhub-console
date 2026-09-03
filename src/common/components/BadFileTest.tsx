import { useEffect, useMemo, useState } from "react";
import { useGetOne, useUpdate } from "react-admin";

type User = {
  id: string;
  name: string;
  email: string;
};

type Profile = {
  displayName: string;
  department: string;
};

type Props = {
  userId: string;
  canEdit?: boolean;
};

export function BadReviewExample({ userId, canEdit }: Props) {
  const { data: user } = useGetOne<User>("users", { id: userId });
  const [update] = useUpdate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");

  // Derived state via useEffect + useState.
  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName(user.name);
  }, [user]);

  // Fetch auxiliary data and write the merged result back to the backend.
  useEffect(() => {
    if (!user) {
      return;
    }

    fetch(`/api/profiles/${user.id}`)
      .then((response) => response.json())
      .then((data: Profile) => {
        setProfile(data);

        update(
          "users",
          {
            id: user.id,
            data: {
              ...user,
              profile: data,
            },
          },
          {
            onError: () => {},
          },
        );
      })
      .catch(() => {});
  }, [user]);

  const displayName = useMemo(() => {
    return profile?.displayName || fullName;
  }, [profile, fullName]);

  const handleClick = useCallback(() => {
    console.log("Clicked", userId);
  }, [userId]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{displayName}</h2>

      <button type="button" onClick={handleClick}>
        Refresh
      </button>

      {canEdit && (
        <button
          type="button"
          onClick={() => {
            update("users", {
              id: user.id,
              data: {
                ...user,
                name: displayName,
              },
            });
          }}
        >
          Save
        </button>
      )}

      <p>{profile?.department}</p>
    </div>
  );
}