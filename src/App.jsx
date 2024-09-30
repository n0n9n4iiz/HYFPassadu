import {
  Box,
  Button,
  Chip,
  Grid2,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import { RoundTextField } from "./components/RoundTextField";
import "./App.css";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import liff from "@line/liff";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getParcel,
  getParcel2,
  updateStock,
  updateStock2,
} from "./api/parcel.js";
import { SkeletonItemCard } from "./components/SkeletonItemCard.jsx";

export const AppLoader = async () => {
  //await liff.init({ liffId: import.meta.env.VITE_LIFFID });
  // if (liff.isLoggedIn()) {
  //   return {
  //     line: {
  //       profile: await liff.getProfile(),
  //       isWebUser: liff.getOS() == "web",
  //     },
  //     data: await getParcel2(),
  //   };
  // }
  // liff.login({ redirectUri: `${location.origin}/` });
  return {
    line: {
      profile: "userId",
      isWebUser: liff.getOS() == "web",
    },
    data: await getParcel2(),
  };
};
function App() {
  const dataloader = useLoaderData();
  const [data, setData] = useState(dataloader?.data);
  const [dataFrom, setDataFrom] = useState(0);
  const [dataTo, setDataTo] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState({
    items: data,
    hasMore: true,
  });
  const [isSlideIn, setIsSlideIn] = useState(true);

  const fetchMoreData = async () => {
    setIsSlideIn((prev) => !prev);
    const nextDataFrom = dataFrom + 10;
    const nextDataTo = dataTo + 10;
    const newItems = await fetchGetParcel(search, nextDataFrom, nextDataTo);
    setState((prevState) => {
      return {
        items: [...prevState.items, ...newItems],
        hasMore: newItems.length > 0,
      };
    });
    setDataFrom(nextDataFrom);
    setDataTo(nextDataTo);
  };
  useEffect(() => {
    (async () => {
      const initialFrom = 0;
      const initialTo = 10;
      setDataFrom(initialFrom);
      setDataTo(initialTo);
      const filteredItems = await fetchGetParcel(
        search,
        initialFrom,
        initialTo
      );
      setState({
        items: filteredItems,
        hasMore: filteredItems.length === 10,
      });
    })();
  }, [search]);

  useEffect(() => {
    setIsSlideIn((prev) => !prev);
    setTimeout(() => {
      setIsSlideIn((prev) => !prev);
    }, 150);
  }, [search]);

  const fetchGetParcel = async (search, from, to) => {
    //const res = await getParcel(search, from, to);
    const res = filterData(search, from, to);
    return res;
    //return res?.data;
  };

  const filterData = (search, from, to) => {
    return search
      ? data
          .filter((x) =>
            x.parCelName.toLowerCase().includes(search.toLowerCase())
          )
          .slice(from, to)
      : data.slice(from, to);
  };

  const handleClickItem = async (e) => {
    const itemSelectd = state.items[e];
    if (Number(itemSelectd.stockQuantity) >= 0) {
      const { value: formValues } = await Swal.fire({
        title: "กรุณากรอกข้อมูลการเบิก",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        html: `
        <input id="swal-input-quantity" class="swal2-input" placeholder="จำนวนที่ต้องการ">
        <input id="swal-input-using" class="swal2-input" placeholder="เหตุผลการเบิก">
      `,
        focusConfirm: false,
        preConfirm: () => {
          if (!document.getElementById("swal-input-quantity").value) {
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> กรุณากรอกจำนวนด้วยตัวเลข'
            );
            return;
          }
          if (!document.getElementById("swal-input-using").value) {
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> กรุณากรอกเหตุผลการเบิก'
            );
            return;
          }
          return [
            document.getElementById("swal-input-quantity").value,
            document.getElementById("swal-input-using").value,
          ];
        },
      });
      await updateStock2(dataloader.line.profile.userId,itemSelectd.parCelCode, formValues[0], formValues[1]);
      // if (quantity > itemSelectd.stockQuantity) {
      //   notEnough(itemSelectd, quantity);FF
      // } else if (quantity) {
      //   const text = `ฉันต้องการเบิกพัสดุ\nรหัส : ${
      //     itemSelectd.parCelCode
      //   }\nชื่อ : ${itemSelectd.parCelName}\nจำนวน : ${quantity} ${
      //     itemSelectd.Unit || "#N/A"
      //   }\nสถานที่จัดเก็บ : ${itemSelectd.locationStock}`;
      //   await updateStock2(dataloader.line.profile.userId,itemSelectd.parCelCode, quantity,"-");
      //   handleSendTextLine(text);
      // }
    } else {
      notEnough(itemSelectd, 0);
    }
  };
  const notEnough = (itemSelectd, quantity) => {
    Swal.fire({
      title: "พัสดุไม่เพียงพอ",
      text: "ท่านต้องการแจ้งเจ้าหน้าที่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ฉันต้องการแจ้ง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const textOption = `จำนวน : ${quantity} (${itemSelectd.Stock}) ${itemSelectd.Unit}\nสถานที่จัดเก็บ : ${itemSelectd.Location}`;
        const text = `ฉันต้องการเบิกพัสดุนี้ แต่พัสดุไม่เพียงพอ\nรหัส : ${
          itemSelectd.Material
        }\nชื่อ : ${itemSelectd.MaterialDescription}${
          Number(quantity) > 0 ? "\n" + textOption : ""
        }`;
        handleSendTextLine(text);
      }
    });
  };
  const handleReportForItem = async () => {
    const { value: formValues } = await Swal.fire({
      title: "ระบุพัสดุที่ต้องการ",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="ชื่อพัสดุที่ต้องการ">
        <input id="swal-input2" class="swal2-input" placeholder="จำนวนที่ต้องการ">
      `,
      focusConfirm: false,
      preConfirm: () => {
        if (!document.getElementById("swal-input1").value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> กรุณากรอกชื่อพัสดุ'
          );
          return;
        }
        if (!document.getElementById("swal-input2").value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> กรุณากรอกจำนวนด้วยตัวเลข'
          );
          return;
        }
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });
    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
    }
  };
  const handleSendTextLine = async (text) => {
    liff
      .sendMessages([
        {
          type: "text",
          text: text,
        },
      ])
      .then(() => {
        liff.closeWindow();
      })
      .catch((error) => {
        window.alert("Error sending message: " + error.message);
      });
  };
  return (
    <Grid2 container spacing={2}>
      <Grid2
        size={12}
        height={"5vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        marginTop={1}
      >
        <RoundTextField
          width="70%"
          className={"input-round"}
          value={search}
          setValue={setSearch}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Grid2>
      <Grid2 size={12} height={"80vh"} component={Box}>
        <InfiniteScroll
          height={"100%"}
          dataLength={state.items.length}
          style={{
            height: "inherit",
            padding: 4,
          }}
          next={fetchMoreData}
          hasMore={state.hasMore}
          loader={
            <Grid2 container spacing={2} marginTop={2}>
              {Array.from({ length: 5 }).map((x, index) => {
                return (
                  <Grid2 size={12} key={index}>
                    <SkeletonItemCard />
                  </Grid2>
                );
              })}
            </Grid2>
          }
          endMessage={
            <>
              <Typography
                fontWeight={500}
                sx={{ textAlign: "center", marginTop: 2 }}
              >
                รายการทั้งหมดมี {state.items.length} รายการ
              </Typography>
              <Button fullWidth onClick={handleReportForItem}>
                หากต้องการรายการอื่น คลิกเพื่อแจ้ง
              </Button>
            </>
          }
        >
          <Grid2 container spacing={2} className="card">
            {state.items.map((x, index) => {
              const chipColor =
                Number(x.stockQuantity) > 5
                  ? "success"
                  : Number(x.stockQuantity) <= 5 && Number(x.stockQuantity) > 0
                  ? "warning"
                  : "error";
              return (
                <Slide
                  direction="up"
                  key={index}
                  in={isSlideIn}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid2
                    size={12}
                    component={Paper}
                    padding={2}
                    onDoubleClick={() => handleClickItem(index)}
                  >
                    <Box>
                      <Grid2 container spacing={1}>
                        <Grid2 size={12}>
                          <Typography fontWeight={500}>
                            รหัส : &nbsp;
                          </Typography>
                          <Typography>{x.parCelCode}</Typography>
                        </Grid2>
                        <Grid2 size={12}>
                          <Typography fontWeight={500}>
                            ชื่อ : &nbsp;
                          </Typography>
                          <Typography>
                            {x.parCelName === "#N/A" ? "-" : x.parCelName}
                          </Typography>
                        </Grid2>
                        <Grid2 size={12}>
                          <Typography fontWeight={500}>
                            จำนวน : &nbsp;
                          </Typography>
                          <Box>
                            <Chip
                              label={
                                <Typography>
                                  {x.stockQuantity === "#N/A"
                                    ? 0
                                    : x.stockQuantity}
                                </Typography>
                              }
                              size="small"
                              color={chipColor}
                              sx={{ minWidth: 50 }}
                            />
                            &nbsp;
                          </Box>
                          <Typography>
                            {x.unit === "#N/A" ? "" : x.unit}
                          </Typography>
                        </Grid2>
                        <Grid2 size={12}>
                          <Typography fontWeight={500}>
                            สถานที่จัดเก็บ : &nbsp;
                          </Typography>
                          <Typography>{x.locationStock}</Typography>
                        </Grid2>
                      </Grid2>
                    </Box>
                  </Grid2>
                </Slide>
              );
            })}
          </Grid2>
        </InfiniteScroll>
      </Grid2>
    </Grid2>
  );
}

export default App;
