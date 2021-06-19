import React, { FC, useEffect } from "react";
import { Datagrid } from "react-admin";
import {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} from "./users-api";
import { isEqual, omit } from "lodash";

export const RtkList: FC = () => {
  const { data: users } = useGetUsersQuery({
    filter: {},
    pagination: { page: 1, perPage: 50 },
    sort: { field: "created_at", order: "ASC" },
  });
  const { data: user2 } = useGetUserQuery(2);
  const { data: user4 } = useGetUserQuery(4);
  const { data: user5 } = useGetUserQuery(5);
  const [updateUser, { data: updatedUser }] = useUpdateUserMutation();

  useEffect(() => {
    const isDifferent = !isEqual(
      omit(user5, "updated_at"),
      omit(updatedUser, "updated_at")
    );

    if (user5 && isDifferent) {
      console.log({ user5, updatedUser });

      const newUser = { ...user5, name: "cafe novo123" };

      updateUser(newUser);
    }
  }, [updateUser, user5]);

  return (
    <div>
      {/* <Datagrid
        basePath="/custom"
        currentSort={currentSort}
        data={permissions}
        ids={permissions?.map((_, index) => index) || []}
        loaded={false}
        total={permissions?.length || 0}
      >
        <FunctionField render={(record) => record} />
      </Datagrid> */}
    </div>
  );
};
